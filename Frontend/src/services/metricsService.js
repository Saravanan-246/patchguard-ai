class MetricsService {
  constructor() {
    this.listeners = [];
    this.data = {
      systems: 128,
      vulnerabilities: 34,
      critical: 5,
      riskScore: 72,
    };
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }

  start() {
    setInterval(() => {
      this.data.vulnerabilities += Math.floor(Math.random() * 3 - 1);
      this.data.riskScore = Math.floor(Math.random() * 30) + 60;
      this.listeners.forEach(cb => cb({ ...this.data }));
    }, 4000);
  }
}

export default new MetricsService();