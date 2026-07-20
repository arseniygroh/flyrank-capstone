export default async function HealthCheckPage() {
    const response = await fetch('https://official-joke-api.appspot.com/random_joke', {
      cache: 'no-store' 
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch health check data');
    }
    const data = await response.json();
  
    return (
      <div className="p-8 max-w-2xl mx-auto mt-12 bg-neutral-900 rounded-lg border border-neutral-800">
        <div className="flex items-center gap-3 mb-6 border-b border-neutral-800 pb-4">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h1 className="text-2xl font-bold text-white">System Status: Healthy</h1>
        </div>
        
        <div className="space-y-4 text-neutral-300">
          <p className="text-sm font-mono text-neutral-500 uppercase tracking-widest">
            External API Test
          </p>
          <p className="text-lg font-medium">{data.setup}</p>
          <p className="text-xl text-white font-bold italic">{data.punchline}</p>
        </div>
      </div>
    );
  }