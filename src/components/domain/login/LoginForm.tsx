import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

const LogInForm = () => {
  const handleSubmitLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmitLogin} className='flex w-full flex-col gap-4'>
      <div className=''>
        <label
          htmlFor='email-input'
          className='block pb-2 text-sm font-medium text-gray-700'
        >
          Email
        </label>
        <Input
          id='email-input'
          type='email'
          placeholder='k@example.com'
          // value={email}
          // onChange={handleEmailChange}
          // onClear={() => setEmail('')}
        />
      </div>

      <div className=''>
        <div className='flex items-center justify-between'>
          <label
            htmlFor='password-input'
            className='block pb-2 text-sm font-medium text-gray-700'
          >
            Password
          </label>
          <Link to='/' className='text-main-pink text-sm hover:underline'>
            Forgot Password?
          </Link>
        </div>
        <Input
          id='password-input'
          type='password'
          placeholder='Password'
          // value={password}
          // onChange={handlePasswordChange}
          // onClear={() => setPassword('')}
        />
      </div>

      <Button type='submit' variant='active' className='mt-5'>
        Login
      </Button>
    </form>
  );
};

export default LogInForm;
