import { useState } from 'react';
import { X } from 'lucide-react';
import { SELLER_TERMS } from '../constants';

interface SellerTermsModalProps {
  onAccept: () => void;
  onClose: () => void;
}

/**
 * Modal de termos do vendedor - reutilizavel em diferentes contextos
 */
export function SellerTermsModal({ onAccept, onClose }: SellerTermsModalProps) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative z-10 rounded-2xl shadow-2xl w-full max-w-lg mx-auto flex flex-col max-h-[85vh]"
        style={{ background: 'var(--gray)', border: '1px solid var(--primary)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 pt-5 pb-3 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(135,24,24,0.4)' }}
        >
          <div>
            <h2 className="text-lg font-bold text-white">
              Termos de Servico do Vendedor
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: 'var(--primary-foreground)', opacity: 0.6 }}
            >
              MachoCar Ltda. - Versao 4.2.0 (definitiva)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Terms list - scrollable */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3 text-sm">
          {SELLER_TERMS.map((term) => (
            <div
              key={term.title}
              className="rounded-lg p-3"
              style={{
                background: 'rgba(0,0,0,0.35)',
                border: '1px solid rgba(135,24,24,0.25)',
              }}
            >
              <p
                className="font-semibold mb-1"
                style={{ color: 'var(--primary-foreground)' }}
              >
                {term.title}
              </p>
              <p className="leading-relaxed text-gray-300">{term.text}</p>
            </div>
          ))}

          <p className="text-xs text-gray-500 text-center pt-2">
            Ao aceitar, voce declara ter lido, entendido e concordado com todos
            os itens acima, incluindo os paragrafos que voce pulou.
          </p>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 flex-shrink-0 space-y-3"
          style={{ borderTop: '1px solid rgba(135,24,24,0.4)' }}
        >
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5 w-4 h-4 flex-shrink-0 cursor-pointer"
              style={{ accentColor: 'var(--primary)' }}
            />
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
              Li e aceito os Termos de Servico, inclusive as partes que nao fazem
              o menor sentido.
            </span>
          </label>

          <button
            onClick={onAccept}
            disabled={!accepted}
            className="w-full py-2.5 rounded-lg font-semibold text-sm text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'var(--primary)' }}
          >
            Aceitar e me tornar vendedor
          </button>
        </div>
      </div>
    </div>
  );
}
