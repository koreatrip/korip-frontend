import { motion } from 'motion/react';
import {
  ExclamationCircleIcon, // Compass
  ArrowLeftIcon, // ArrowLeft
  MapPinIcon, // MapPin
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';
import ImageWithFallback from '@/components/common/ImageWithFallback';
import { useTranslation } from 'react-i18next';

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const TravelIllustration = () => {
  return (
    <motion.svg
      width='280'
      height='200'
      viewBox='0 0 280 200'
      fill='none'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      {/* Dashed path - wandering trail */}
      <motion.path
        d='M20 170 Q60 140 80 150 Q110 165 130 130 Q150 95 180 110 Q210 125 230 90 Q250 60 270 70'
        stroke='#ff6b7a'
        strokeWidth='2'
        strokeDasharray='6 6'
        fill='none'
        opacity='0.3'
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 2,
          delay: 0.5,
          ease: 'easeInOut',
        }}
      />

      {/* Pin markers along path */}
      {[
        { x: 80, y: 145, delay: 1.0, color: '#ff6b7a' },
        { x: 135, y: 125, delay: 1.3, color: '#4a9b8e' },
        { x: 185, y: 105, delay: 1.6, color: '#d4a574' },
      ].map((pin, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: pin.delay, duration: 0.5, ease }}
        >
          <circle cx={pin.x} cy={pin.y} r='5' fill={pin.color} opacity='0.2' />
          <circle cx={pin.x} cy={pin.y} r='3' fill={pin.color} />
        </motion.g>
      ))}

      {/* Question mark pin at the end */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: 1.9,
          duration: 0.5,
          type: 'spring',
          bounce: 0.4,
        }}
      >
        <motion.g
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Pin body */}
          <path
            d='M260 70 C260 58 248 48 248 48 C248 48 236 58 236 70 C236 78 241 84 248 84 C255 84 260 78 260 70Z'
            fill='#ff6b7a'
          />
          <circle cx='248' cy='68' r='8' fill='white' opacity='0.9' />
          <text
            x='248'
            y='72'
            textAnchor='middle'
            fill='#ff6b7a'
            fontSize='12'
            fontWeight='bold'
          >
            ?
          </text>
          {/* Pin shadow */}
          <ellipse
            cx='248'
            cy='88'
            rx='6'
            ry='2'
            fill='#ff6b7a'
            opacity='0.15'
          />
        </motion.g>
      </motion.g>

      {/* Small plane */}
      <motion.g
        animate={{
          x: [0, 240, 240],
          y: [0, -60, -60],
          opacity: [1, 1, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatDelay: 3,
          ease: 'easeInOut',
        }}
      >
        <g transform='translate(20, 50) rotate(-15)'>
          <path d='M0 4 L8 0 L16 4 L8 3 Z' fill='#8b9dc3' opacity='0.5' />
        </g>
      </motion.g>

      {/* Cloud 1 */}
      <motion.g
        opacity='0.08'
        animate={{ x: [0, 10, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <ellipse cx='60' cy='35' rx='25' ry='10' fill='#8b9dc3' />
        <ellipse cx='50' cy='30' rx='15' ry='8' fill='#8b9dc3' />
        <ellipse cx='70' cy='32' rx='12' ry='7' fill='#8b9dc3' />
      </motion.g>

      {/* Cloud 2 */}
      <motion.g
        opacity='0.06'
        animate={{ x: [0, -8, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      >
        <ellipse cx='200' cy='25' rx='20' ry='8' fill='#8b9dc3' />
        <ellipse cx='190' cy='20' rx='12' ry='6' fill='#8b9dc3' />
      </motion.g>
    </motion.svg>
  );
};

const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <div className='bg-bg-white relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6'>
      {/* Background travel photo - subtle */}
      <div className='pointer-events-none absolute inset-0'>
        <ImageWithFallback
          src='https://images.unsplash.com/photo-1617804604064-f264bb9cea97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmVhbXklMjB0cmF2ZWwlMjBsYW5kc2NhcGUlMjBhZXJpYWwlMjBvY2VhbiUyMGlzbGFuZHxlbnwxfHx8fDE3NzMzNzU4MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
          alt=''
          className='h-full w-full object-cover opacity-[0.04]'
        />
      </div>

      {/* Subtle gradient overlays */}
      <div className='pointer-events-none absolute inset-0'>
        <div
          className='absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full opacity-[0.04]'
          style={{
            background: 'radial-gradient(circle, #ff6b7a, transparent 70%)',
          }}
        />
        <div
          className='absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full opacity-[0.04]'
          style={{
            background: 'radial-gradient(circle, #4a9b8e, transparent 70%)',
          }}
        />
      </div>

      <div className='relative z-10 flex w-full max-w-md flex-col items-center text-center'>
        {/* Illustration */}
        <TravelIllustration />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5, ease }}
          className='border-main-pink/15 bg-main-pink/5 mt-4 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5'
        >
          <ExclamationCircleIcon className='text-main-pink size-3.5' />
          <span className='text-main-pink text-xs tracking-wider'>
            {t('messages.lost_way')}
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6, ease }}
          className='text-main-text-navy mb-3'
          style={{ fontSize: '1.75rem', lineHeight: 1.3 }}
        >
          {t('messages.not_on_map')}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6, ease }}
          className='text-sub-text-gray mb-10 max-w-xs leading-relaxed'
        >
          {t('messages.page_not_found')}
          <br />
          {t('messages.explore_new_destination')}
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6, ease }}
          className='flex items-center gap-3'
        >
          <button
            onClick={() => window.history.back()}
            className='group border-outline-gray text-main-text-navy hover:border-sub-text-gray/40 flex cursor-pointer items-center gap-2 rounded-xl border bg-white px-5 py-3 transition-all duration-200 hover:shadow-sm active:scale-[0.97]'
          >
            <ArrowLeftIcon className='text-sub-text-gray size-4 transition-transform duration-200 group-hover:-translate-x-0.5' />
            <span>{t('common.button')}</span>
          </button>

          <button
            onClick={() => (window.location.href = '/')}
            className='group bg-main-pink hover:bg-main-hover-pink hover:shadow-main-pink/20 flex cursor-pointer items-center gap-2 rounded-xl px-5 py-3 text-white transition-all duration-200 hover:shadow-md active:scale-[0.97]'
          >
            <MapPinIcon className='size-4' />
            <span>{t('messages.search_destination')}</span>
          </button>
        </motion.div>

        {/* Bottom decorative tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className='mt-14 flex flex-wrap items-center justify-center gap-2'
        >
          {['제주도', '서울', '경주', '울산', '대전'].map((city, i) => (
            <motion.span
              key={city}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1.3 + i * 0.1,
                duration: 0.4,
                ease,
              }}
              className='bg-bg-section border-outline-gray/50 text-sub-text-gray inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs'
            >
              <PaperAirplaneIcon className='text-sub-text-gray/60 size-3' />
              {city}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
