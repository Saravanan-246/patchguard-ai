class AdvancedAttackEngine {
  constructor(io, System, Vulnerability, Attack) {
    this.io = io;
    this.System = System;
    this.Vulnerability = Vulnerability;
    this.Attack = Attack;
  }

  async runAttack(systemId) {
    try {
      const system = await this.System.findById(systemId);
      if (!system) return;

      const openVulns = await this.Vulnerability.find({
        system: systemId,
        status: "open"
      });

      // Only attack if system is exposed
      if (openVulns.length < 1) {
        console.log("System secure. No attack triggered.");
        return;
      }

      // Create attack record
      const attack = await this.Attack.create({
        system: systemId,
        type: "Remote Exploit",
        stage: "reconnaissance",
        severity: "high",
        status: "active"
      });

      this.io.emit("attack:started", attack);

      // Stage 2 – Exploitation
      setTimeout(async () => {
        attack.stage = "exploitation";
        attack.severity = "critical";
        await attack.save();

        this.io.emit("attack:escalated", attack);
      }, 8000);

      // Stage 3 – Privilege Escalation
      setTimeout(async () => {
        attack.stage = "privilege-escalation";
        await attack.save();

        this.io.emit("system:compromised", {
          systemId,
          message: "System compromised"
        });
      }, 15000);

    } catch (error) {
      console.error("Attack Engine Error:", error);
    }
  }
}

module.exports = AdvancedAttackEngine;