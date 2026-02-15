export default function FixedFooter() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-slate-800 dark:bg-slate-950 text-white py-3 shadow-lg print:relative print:mt-8 transition-colors duration-200">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm font-medium">
          Confidential – For Official Use Only
        </p>
      </div>
    </footer>
  );
}
