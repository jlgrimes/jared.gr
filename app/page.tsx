import Chat from './components/chat/index';

export default function Home() {
  return (
    <div className='bg-white dark:bg-gray-900 h-full'>
      <div className='container mx-auto px-4 py-8 flex flex-col h-full'>
        <div className='max-w-2xl mx-auto w-full flex flex-col h-full'>
          <Chat />
        </div>
      </div>
    </div>
  );
}
