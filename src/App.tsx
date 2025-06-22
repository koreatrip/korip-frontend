import './App.css';
import AuthInput from './components/auth/AuthInput';
import Button from './components/common/Button';
import Input from './components/common/Input';
import ToastMessage from './components/common/ToastMessage';

function App() {
  return (
    <>
      <AuthInput
        type='text'
        label='인증번호'
        placeholder='인증번호를 입력하세요'
      />
      <Button variant='cancel'>취소</Button>
      <Button>로그인</Button>
      <Button className='bg-sub-green rounded-full'>선택완료</Button>
      <Input />
      <ToastMessage message='테스ㅡㅌ' />
    </>
  );
}
export default App;
