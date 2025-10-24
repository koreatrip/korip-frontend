// hooks/usePdfExport.ts
import { exportAPI } from '@/api/export/exportAPI';
import { useToast } from '@/hooks/useToast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const usePdfExport = () => {
  const { showToast } = useToast();
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const generatePdf = async (planId: string, lang?: string) => {
    const currentLang = lang || i18n.language;

    try {
      setIsLoading(true);
      showToast(t('common.pdf_generating'), 'info');

      console.log('🌍 PDF 생성 언어:', currentLang);

      // 1. API에서 데이터 가져오기
      const data = await exportAPI.exportPlanPdfData({
        plan_id: planId,
        lang: currentLang,
      });

      console.log('📄 API 응답 데이터:', data);

      // 언어별 텍스트 (ja와 jp 모두 지원)
      const translations = {
        ko: {
          empty: '비어있는 일정',
          time: '시간',
          place: '장소명',
          category: '카테고리',
        },
        en: {
          empty: 'Empty Schedule',
          time: 'Time',
          place: 'Place',
          category: 'Category',
        },
        ja: {
          empty: '空のスケジュール',
          time: '時間',
          place: '場所',
          category: 'カテゴリ',
        },
        jp: {
          // jp도 추가 (ja와 동일)
          empty: '空のスケジュール',
          time: '時間',
          place: '場所',
          category: 'カテゴリ',
        },
        cn: {
          empty: '空日程',
          time: '时间',
          place: '地点',
          category: '类别',
        },
        zh: {
          // zh도 추가 (cn과 동일)
          empty: '空日程',
          time: '时间',
          place: '地点',
          category: '类别',
        },
      };

      // 언어 매칭
      const findTexts = (lang: string) => {
        const keys = Object.keys(translations) as Array<
          keyof typeof translations
        >;
        const matchingKey = keys.find(
          (key) => lang === key || lang.startsWith(`${key}-`)
        );
        return matchingKey ? translations[matchingKey] : translations.ko;
      };

      const texts = findTexts(currentLang);

      // 날짜 로케일 매핑
      const getDateLocale = (lang: string): string => {
        if (lang.startsWith('ko')) return 'ko-KR';
        if (lang.startsWith('en')) return 'en-US';
        if (lang.startsWith('ja') || lang.startsWith('jp')) return 'ja-JP';
        if (lang.startsWith('cn') || lang.startsWith('zh')) return 'zh-CN';
        return 'ko-KR';
      };

      const dateLocale = getDateLocale(currentLang);

      console.log('🗣️ 사용할 번역:', texts);
      console.log('📅 날짜 로케일:', dateLocale);

      // 2. HTML 엑셀 스타일 템플릿 생성
      const container = document.createElement('div');
      container.style.width = '210mm';
      container.style.padding = '15mm';
      container.style.backgroundColor = 'white';
      container.style.fontFamily = 'Arial, sans-serif';

      container.innerHTML = `
        <div style="margin-bottom: 20px;">
          <h1 style="font-size: 18px; font-weight: bold; margin: 0 0 5px 0;">${data.title}</h1>
          <p style="font-size: 11px; color: #666; margin: 0 0 3px 0;">${data.description}</p>
          <p style="font-size: 9px; color: #999; margin: 0;">${new Date(data.created_at).toLocaleDateString(dateLocale)}</p>
        </div>

        ${data.schedule
          .map(
            (day) => `
          <div style="margin-bottom: 25px;">
            <div style="font-size: 13px; font-weight: bold; margin-bottom: 8px; padding: 5px; background: #f0f0f0; border: 1px solid #ccc;">
              Day ${day.day} - ${day.date}
            </div>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
              <thead>
                <tr style="background: #f8f8f8;">
                  <th style="border: 1px solid #ccc; padding: 8px; text-align: center; font-weight: bold; width: 80px;">${texts.time}</th>
                  <th style="border: 1px solid #ccc; padding: 8px; text-align: left; font-weight: bold;">${texts.place}</th>
                  <th style="border: 1px solid #ccc; padding: 8px; text-align: center; font-weight: bold; width: 100px;">${texts.category}</th>
                </tr>
              </thead>
              <tbody>
                ${day.places
                  .map((place) => {
                    // ✅ "알 수 없는 장소"를 빈 일정으로 처리
                    const isEmpty =
                      !place.place_name ||
                      place.place_name === '알 수 없는 장소' ||
                      place.place_name.includes('알 수 없는');

                    const displayName = isEmpty
                      ? texts.empty
                      : place.place_name;

                    return `
      <tr>
        <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${place.time}</td>
        <td style="border: 1px solid #ccc; padding: 8px; ${isEmpty ? 'color: #999; font-style: italic;' : ''}">${displayName}</td>
        <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${place.category || '-'}</td>
      </tr>
    `;
                  })
                  .join('')}
              </tbody>
            </table>
          </div>
        `
          )
          .join('')}
      `;

      // 3. DOM에 임시로 추가
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      document.body.appendChild(container);

      // 4. HTML을 캔버스로 변환
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      // 5. 캔버스를 PDF로 변환
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // 첫 페이지
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;

      // 여러 페이지 처리
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      // 6. DOM에서 제거
      document.body.removeChild(container);

      // 7. PDF 저장
      pdf.save(`${data.title}.pdf`);
      showToast(t('common.pdf_saved'), 'success');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || t('common.pdf_generation_failed');
      showToast(errorMessage, 'error');
      console.error('PDF 생성 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generatePdf,
    isLoading,
  };
};
