import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pas d'envoi réel pour l'instant : à connecter à un service d'email
    // ou à une fonction Supabase plus tard.
    setSent(true);
  };

  return (
    <section className="container-page py-16 md:py-20 grid md:grid-cols-2 gap-14">
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-coral mb-3">
          On en parle ?
        </p>
        <h1 className="text-3xl md:text-4xl mb-6 max-w-md">
          Une occasion à célébrer, ou aucune raison précise ?
        </h1>
        <p className="text-ink/70 mb-10 max-w-sm">
          Écrivez-nous, on adore autant les grands événements que les envies
          spontanées de faire plaisir.
        </p>

        <ul className="space-y-4 text-sm text-ink/70">
          <li>
            <span className="block text-forest font-medium">Email</span>
            contact@grandebox.fr
          </li>
          <li>
            <span className="block text-forest font-medium">Zone de livraison</span>
            Toute la France
          </li>
        </ul>
      </div>

      <div className="bg-cream-soft rounded-xl2 p-8">
        {sent ? (
          <p className="text-forest font-display text-xl">
            Merci ! On revient vers vous très vite. 🎉
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-forest mb-2">
                Votre nom
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-forest/20 p-3 text-sm focus:border-forest outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest mb-2">
                Votre email
              </label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-forest/20 p-3 text-sm focus:border-forest outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest mb-2">
                Votre message
              </label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-xl border border-forest/20 p-3 text-sm focus:border-forest outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-forest text-cream py-3.5 font-medium hover:bg-forest-light transition-colors"
            >
              Envoyer
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
