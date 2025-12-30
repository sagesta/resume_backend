import Link from "next/link";
import { FileText, FolderGit2, Briefcase, Award } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-slate-50 text-slate-900">
      <h1 className="text-4xl font-bold mb-12">Cloud Resume CSM Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Link href="/posts" className="group">
          <div className="bg-white p-8 rounded-xl shadow-md border hover:shadow-lg transition-all flex flex-col items-center gap-4 group-hover:border-blue-500">
            <FolderGit2 className="w-16 h-16 text-blue-500" />
            <h2 className="text-2xl font-semibold">Manage Projects / Posts</h2>
            <p className="text-slate-500 text-center">Add, edit, or delete blog posts and project showcases.</p>
          </div>
        </Link>

        <Link href="/specs/skills" className="group">
          <div className="bg-white p-8 rounded-xl shadow-md border hover:shadow-lg transition-all flex flex-col items-center gap-4 group-hover:border-emerald-500">
            <Award className="w-16 h-16 text-emerald-500" />
            <h2 className="text-2xl font-semibold">Skills & Certifications</h2>
            <p className="text-slate-500 text-center">Update your skills list and certifications.</p>
          </div>
        </Link>

        <Link href="/specs/experience" className="group">
          <div className="bg-white p-8 rounded-xl shadow-md border hover:shadow-lg transition-all flex flex-col items-center gap-4 group-hover:border-purple-500">
            <Briefcase className="w-16 h-16 text-purple-500" />
            <h2 className="text-2xl font-semibold">Experience</h2>
            <p className="text-slate-500 text-center">Update your professional experience history.</p>
          </div>
        </Link>

        <Link href="/specs/about" className="group">
          <div className="bg-white p-8 rounded-xl shadow-md border hover:shadow-lg transition-all flex flex-col items-center gap-4 group-hover:border-orange-500">
            <FileText className="w-16 h-16 text-orange-500" />
            <h2 className="text-2xl font-semibold">About Me</h2>
            <p className="text-slate-500 text-center">Edit your bio and introduction.</p>
          </div>
        </Link>
      </div>
    </main>
  );
}
