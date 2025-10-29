import BackToTop from '../BackToTop';

export default function BackToTopExample() {
  return (
    <div className="h-[200vh] flex items-center justify-center">
      <p className="text-muted-foreground">Scroll down to see the Back to Top button</p>
      <BackToTop />
    </div>
  );
}
