export default function Mesh() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] rounded-full blur-3xl opacity-30 animate-drift -top-20 -left-20" style={{ background: 'radial-gradient(circle,#0033A0,transparent 70%)' }} />
      <div className="absolute w-[260px] h-[260px] sm:w-[500px] sm:h-[500px] rounded-full blur-3xl opacity-30 animate-drift top-[15%] -right-16 sm:-right-24" style={{ background: 'radial-gradient(circle,#CC0000,transparent 70%)', animationDelay: '5s', animationDirection: 'reverse' }} />
      <div className="absolute w-[240px] h-[240px] sm:w-[450px] sm:h-[450px] rounded-full blur-3xl opacity-30 animate-drift bottom-[5%] left-[10%] sm:left-[20%]" style={{ background: 'radial-gradient(circle,#C9A84C,transparent 70%)', animationDelay: '10s' }} />
      <div className="absolute w-[200px] h-[200px] sm:w-[350px] sm:h-[350px] rounded-full blur-3xl opacity-30 animate-drift -bottom-16 right-[5%] sm:right-[10%]" style={{ background: 'radial-gradient(circle,#0033A0,transparent 70%)', animationDelay: '15s', animationDirection: 'reverse' }} />
    </div>
  );
}
