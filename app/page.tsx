import Chat from "./components/chat/index";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
        <div className="max-w-2xl mx-auto w-full flex flex-col h-[calc(100vh-4rem)]">
          <Chat />
        </div>
      </div>
    </div>
  );
}
