import { useState } from 'react';
import './App.css';
import AuthInput from './components/auth/AuthInput';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <AuthInput
        type='text'
        label='인증번호'
        placeholder='인증번호를 입력하세요'
      />
    </>
  );
}
export default App;
