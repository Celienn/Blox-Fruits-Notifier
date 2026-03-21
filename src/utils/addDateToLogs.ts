const methods = ['log','info','warn','error','debug','trace'];
const orig: Record<string, any> = {};
for (const m of methods) {
    orig[m] = (console as any)[m].bind(console);
    (console as any)[m] = (...args: any[]) => {
        const ts = new Date().toLocaleString();
        orig[m](ts, ...args);
  };
}