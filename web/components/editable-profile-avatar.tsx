"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { toast } from "sonner";
import { Camera, Edit, Trash2, UploadCloud, X, AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { useUser } from "@/contexts/user-context";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function EditableProfileAvatar() {
    const userCtx = useUser();
    const currentUser = userCtx?.user;
    const {
        updateAvatar,
        isUpdatingAvatar,
        deleteAvatar,
        isDeletingAvatar,
    } = useAuth();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const initials = currentUser
        ? `${currentUser.name?.[0] || ""}${currentUser.lastName?.[0] || ""}`.toUpperCase() || "U"
        : "FC";

    const currentAvatarUrl = currentUser?.avatar || "";
    const displayedAvatarUrl = previewUrl || currentAvatarUrl;

    useEffect(() => {
        if (!isModalOpen) {
            setSelectedFile(null);
            setErrorMessage(null);
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
            }
        }
    }, [isModalOpen]);

    useEffect(() => {
        if (!isModalOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                setIsModalOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isModalOpen]);

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        setErrorMessage(null);
        const file = e.target.files?.[0];
        if (!file) return;

        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            setErrorMessage("Formato não permitido. Envie apenas imagens JPG, PNG ou WEBP.");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        if (file.size > MAX_AVATAR_BYTES) {
            setErrorMessage("A imagem excede o limite máximo de segurança de 2MB.");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        const nextPreview = URL.createObjectURL(file);
        setSelectedFile(file);
        setPreviewUrl(nextPreview);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleUploadSelectedOrTriggerPicker = async () => {
        if (!selectedFile) {
            fileInputRef.current?.click();
            return;
        }

        setErrorMessage(null);
        try {
            await updateAvatar(selectedFile);
            toast.success("Avatar atualizado com sucesso!");
            setIsModalOpen(false);
        } catch (err: any) {
            const msg = err?.message || "Não foi possível atualizar o avatar.";
            setErrorMessage(msg);
            toast.error("Erro ao atualizar avatar", { description: msg });
        }
    };

    const handleRemoveAvatar = async () => {
        setErrorMessage(null);
        try {
            await deleteAvatar();
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
            }
            setSelectedFile(null);
            toast.success("Avatar removido com sucesso!");
            setIsModalOpen(false);
        } catch (err: any) {
            const msg = err?.message || "Não foi possível remover o avatar.";
            setErrorMessage(msg);
            toast.error("Erro ao remover avatar", { description: msg });
        }
    };

    return (
        <>
            <div className="relative group rounded-full w-24 h-24 shrink-0">
                <Avatar className="w-24 h-24">
                    {currentAvatarUrl && (
                        <AvatarImage src={currentAvatarUrl} alt={currentUser?.fullName || "Avatar"} />
                    )}
                    <AvatarFallback className="text-2xl font-bold bg-primary/15 text-primary">
                        {initials}
                    </AvatarFallback>
                </Avatar>

                <button
                    type="button"
                    aria-label="Editar foto de perfil"
                    onClick={() => setIsModalOpen(true)}
                    className="absolute inset-0 rounded-full bg-black/55 text-white opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                    <Edit className="size-5" />
                    <span className="text-[11px] font-semibold">Editar</span>
                </button>
            </div>

            <Sheet open={isModalOpen} onOpenChange={setIsModalOpen}>
                <SheetContent
                    showCloseButton={false}
                    className="inset-auto! left-1/2! top-1/2! -translate-x-1/2! -translate-y-1/2! w-[calc(100%-2rem)]! max-w-md! h-auto! rounded-xl! border! shadow-xl! p-4 flex flex-col gap-5"
                >
                    <SheetHeader className="flex flex-row items-center justify-between border-b pb-2 p-0">
                        <div className="flex items-center gap-2">
                            <Camera className="size-5 text-primary" />
                            <SheetTitle className="text-lg font-bold">
                                Foto de Perfil
                            </SheetTitle>
                        </div>
                        <button
                            type="button"
                            aria-label="Fechar modal"
                            onClick={() => setIsModalOpen(false)}
                            className="text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                            <X className="size-5" />
                        </button>
                    </SheetHeader>

                    <SheetDescription className="sr-only">
                        Visualize sua foto atual, envie uma nova imagem de até 2MB ou remova seu avatar.
                    </SheetDescription>

                    <div className="flex flex-col items-center gap-3 py-2">
                        <Avatar className="w-32 h-32 ring-2 ring-primary/20">
                            {displayedAvatarUrl && (
                                <AvatarImage src={displayedAvatarUrl} alt="Pré-visualização do avatar" />
                            )}
                            <AvatarFallback className="text-3xl font-bold bg-primary/15 text-primary">
                                {initials}
                            </AvatarFallback>
                        </Avatar>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleFileSelect}
                            className="hidden"
                        />

                        {selectedFile ? (
                            <div className="text-center space-y-1">
                                <p className="text-xs font-medium text-foreground truncate max-w-64">
                                    Nova imagem: {selectedFile.name}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-xs text-primary hover:underline cursor-pointer"
                                >
                                    Escolher outra imagem
                                </button>
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground text-center">
                                Formatos permitidos: JPG, PNG ou WEBP • Tamanho máximo: 2MB
                            </p>
                        )}
                    </div>

                    {errorMessage && (
                        <div
                            role="alert"
                            className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/30 px-3 py-2 text-xs text-destructive font-medium"
                        >
                            <AlertTriangle className="size-4 shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    <SheetFooter className="flex flex-col sm:flex-row items-center justify-end sm:justify-between gap-2.5 py-3 px-0 border-t mt-0">
                        <Button
                            type="button"
                            variant="destructive"
                            className="w-full sm:w-auto"
                            disabled={(!currentAvatarUrl && !selectedFile) || isDeletingAvatar || isUpdatingAvatar}
                            onClick={handleRemoveAvatar}
                        >
                            <Trash2 className="size-4 mr-1.5" />
                            {isDeletingAvatar ? "Removendo..." : "Remover avatar"}
                        </Button>

                        <Button
                            type="button"
                            className="w-full sm:w-auto"
                            disabled={isUpdatingAvatar || isDeletingAvatar}
                            onClick={handleUploadSelectedOrTriggerPicker}
                        >
                            <UploadCloud className="size-4 mr-1.5" />
                            {isUpdatingAvatar
                                ? "Enviando..."
                                : selectedFile
                                  ? "Confirmar novo avatar"
                                  : "Atualizar avatar"}
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    );
}
