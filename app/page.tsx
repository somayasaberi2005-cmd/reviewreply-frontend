import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-4">
        Welcome to ReviewReply
      </h1>
      <Button>Get Started</Button>
      <div className="bg-brand-400 text-white p-4 rounded-lg mt-4">
        Testing brand orange
      </div>
    </div>
  );
}