import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation';

const Header = () => {
  const router = useRouter();
  const searchParams = useSearchParams()
  const [text, setText] = useState<string>('');

  const searchClick = () => {
    router.push({
      pathname: '/',
      query: { keyword: text },
    })
  }

  const inputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing || e.key !== 'Enter'){
      return;
    }
    searchClick();
  }

  useEffect(() => {
    setText(searchParams.get('keyword') ?? '');
 }, [ searchParams])
  
  return (
    <header className="border-b flex items-center h-14 px-4 shadow-md">
        <div className="">
          Note
        </div>
        <div className="ml-auto">
          <input type="text" className="bg-gray-50 border border-gray-300 rounded-lg py-1 px-2 w-64 mr-2"
             value={text}
             onChange={(e) => setText(e.target.value)}
             placeholder='Search...'
             onKeyDown={inputKeyDown}
             />
          <button onClick={searchClick} className='bg-gray-500 hover:bg-gray-400 text-white rounded-lg px-4 py-1'>Search</button>
        </div>
    </header>
  );
};

export default Header;
