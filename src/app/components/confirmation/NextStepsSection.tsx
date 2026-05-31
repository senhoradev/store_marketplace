interface NextStep {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface NextStepsSectionProps {
  title: string;
  steps: NextStep[];
}

/**
 * Secao de proximos passos
 */
export function NextStepsSection({ title, steps }: NextStepsSectionProps) {
  return (
    <section className="mb-20">
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-10">
        {title}
      </h2>

      <div className="grid md:grid-cols-3 gap-8 md:gap-12">
        {steps.map((step, index) => (
          <div key={index}>
            <div className="flex items-center justify-center size-12 rounded-full bg-[#871818]/10 text-[#871818] mb-4">
              {step.icon}
            </div>
            <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
