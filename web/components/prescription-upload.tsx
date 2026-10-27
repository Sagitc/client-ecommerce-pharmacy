// web/components/PrescriptionUpload.tsx
"use client";

import { useState, useRef } from "react";
import { FileText, UploadCloud, Trash2, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CartItemForPrescription {
  id: number | string;
  name: string;
  requiresPrescription?: boolean;
}

interface PrescriptionUploadProps {
  cartItems: CartItemForPrescription[];
  onFilesChange: (files: File[], isValid: boolean) => void;
}

export function PrescriptionUpload({ cartItems, onFilesChange }: PrescriptionUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtra apenas os produtos do carrinho que exigem retenção de receita
  const restrictedItems = cartItems.filter((item) => item.requiresPrescription);

  if (restrictedItems.length === 0) {
    return null;
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (!e.target.files || e.target.files.length === 0) return;

    const selectedFiles = Array.from(e.target.files);
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB por arquivo

    for (const file of selectedFiles) {
      if (!allowedTypes.includes(file.type)) {
        setError("Formato inválido. Envie apenas fotos (JPG, PNG) ou arquivos PDF.");
        return;
      }
      if (file.size > maxSizeBytes) {
        setError(`O arquivo "${file.name}" excede o limite máximo de 5MB.`);
        return;
      }
    }

    const updatedFiles = [...files, ...selectedFiles];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles, updatedFiles.length > 0);

    // Reseta o input para permitir selecionar o mesmo arquivo caso tenha sido removido
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    const updatedFiles = files.filter((_, idx) => idx !== indexToRemove);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles, updatedFiles.length > 0);
  };

  return (
    <div className="border-2 border-amber-500/40 bg-amber-500/5 rounded-xl p-5 space-y-4">
      {/* CABEÇALHO DE ALERTA REGULATÓRIO */}
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg shrink-0 mt-0.5">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-base text-foreground">
            Envio Obrigatório de Receita Médica
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Seu pedido contém medicamentos sujeitos à retenção de receita segundo a ANVISA. 
            Anexe a foto ou PDF da receita (frente e verso, se houver) para avaliação do nosso farmacêutico:
          </p>
        </div>
      </div>

      {/* LISTA DOS MEDICAMENTOS QUE ATIVARAM A REGRA */}
      <div className="bg-background/80 border rounded-lg p-3 space-y-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
          Itens que exigem receita neste pedido:
        </span>
        <ul className="space-y-1">
          {restrictedItems.map((item) => (
            <li key={item.id} className="text-xs font-medium text-foreground flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              {item.name}
            </li>
          ))}
        </ul>
      </div>

      {/* ÁREA DE DROP / SELEÇÃO DE ARQUIVOS */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-border hover:border-primary/60 bg-background rounded-xl p-6 text-center cursor-pointer transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,.pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
        <UploadCloud className="w-8 h-8 text-primary mx-auto mb-2" />
        <p className="text-sm font-semibold text-foreground">
          Clique para anexar a foto ou PDF da receita
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Formatos aceitos: JPG, PNG ou PDF (Máx. 5MB por arquivo). Certifique-se de que o carimbo do médico e a data estejam legíveis.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-destructive font-medium bg-destructive/10 p-3 rounded-lg">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* LISTA DE ARQUIVOS ANEXADOS */}
      {files.length > 0 ? (
        <div className="space-y-2">
          <span className="text-xs font-semibold text-green-600 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Receita anexada ({files.length} {files.length === 1 ? "arquivo" : "arquivos"})
          </span>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between bg-background border rounded-lg px-3 py-2 text-xs"
              >
                <div className="flex items-center gap-2 truncate pr-3">
                  <FileText className="w-4 h-4 text-primary shrink-0" />
                  <span className="truncate font-medium text-foreground">{file.name}</span>
                  <span className="text-muted-foreground shrink-0">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFile(index)}
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
          * O botão de finalizar compra só será liberado após anexar ao menos uma receita válida.
        </p>
      )}
    </div>
  );
}