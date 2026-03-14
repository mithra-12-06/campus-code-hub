import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { problems } from "@/data/problems";
import { ArrowLeft } from "lucide-react";

export default function ProblemDetail() {
  const { id } = useParams();
  const problem = problems.find(p => p.id === Number(id));

  if (!problem) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <p className="text-muted-foreground">Problem not found.</p>
        <Link to="/problems" className="text-primary text-sm hover:underline">← Back to problems</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/problems" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-3 w-3" /> Back to Problems
        </Link>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs text-muted-foreground">#{problem.id}</span>
            <span className={`rounded px-2 py-0.5 text-xs font-medium ${
              problem.difficulty === "Easy" ? "bg-easy text-easy" :
              problem.difficulty === "Medium" ? "bg-medium text-medium" :
              "bg-hard text-hard"
            }`}>
              {problem.difficulty}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">{problem.title}</h1>

          <div className="flex flex-wrap gap-2 mb-6">
            {problem.tags.map(t => (
              <span key={t} className="rounded bg-accent px-2 py-0.5 text-xs text-muted-foreground">{t}</span>
            ))}
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-2">Description</h2>
              <p className="text-sm text-foreground leading-relaxed">{problem.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-md bg-secondary p-4">
                <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-2">Example Input</h3>
                <code className="font-mono text-sm text-primary">{problem.exampleInput}</code>
              </div>
              <div className="rounded-md bg-secondary p-4">
                <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-2">Example Output</h3>
                <code className="font-mono text-sm text-primary">{problem.exampleOutput}</code>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
