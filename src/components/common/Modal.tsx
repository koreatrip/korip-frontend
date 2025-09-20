import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { createContext, useContext } from 'react';

type TModalContextType = {
  onClose: () => void;
};

type TModalProps = {
  isOpen: boolean;
  onClose: () => void;

  children: React.ReactNode;
};

/**
 * --- Context 생성 ---
 * onClose 함수를 자식들에게 물려주기 위해 Context를 사용 (Prop Drilling 방지)
 * */
const ModalContext = createContext<TModalContextType | null>(null);

/**
 * 메인 Modal 컴포넌트
 */
export const Modal = ({ isOpen, onClose, children }: TModalProps) => {
  if (!isOpen) return null;

  return (
    <ModalContext value={{ onClose }}>
      {/* Modal Backdrop (배경) */}
      <div
        className='bg-main-text-navy/40 fixed inset-0 z-50 flex items-center justify-center'
        onClick={onClose}
      >
        {/* Modal Panel (내용이 들어가는 흰색 박스) */}
        <div
          className='bg-bg-white shadow-medium relative flex w-full max-w-lg flex-col rounded-2xl'
          onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히는 현상 방지
        >
          {children}
        </div>
      </div>
    </ModalContext>
  );
};

// --- Modal Header ---
export const Header = ({ children }: { children?: React.ReactNode }) => {
  const { onClose } = useContext(ModalContext)!;
  return (
    <div className='flex items-center px-9 pt-8 pb-5'>
      <div className='border-outline-gray flex w-full items-center justify-between border-b pb-4'>
        <h3 className='text-main-text-navy text-2xl font-semibold'>
          {children}
        </h3>
        <button onClick={onClose} className='cursor-pointer'>
          <XMarkIcon className='text-main-text-navy h-8 w-8 stroke-2' />
        </button>
      </div>
    </div>
  );
};

/**
 * 모달 바디
 * @param param0
 * @returns
 */
export const Body = ({ children }: { children: React.ReactNode }) => {
  return <div className='overflow-y-auto px-9'>{children}</div>;
};

/**
 * 모달 푸터
 * @param param0 버튼
 * @returns
 */
export const Footer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex justify-end space-x-3 rounded-b-2xl px-9 pb-8'>
      {children}
    </div>
  );
};

/**
 * 컴파운드 컴포넌트로 사용하기 위해 각 컴포넌트를 Modal의 속성으로 할당
 */
Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;

// 임시
export default Modal;
// export default Modal;
