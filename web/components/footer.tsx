import { Headset } from "lucide-react";

export default function Footer() {

    function FooterLinksElement({ title, links, imgs = false }: { title: string, links: { label: string, url: string }[], imgs?: boolean }) {

        // DEFININDO OS LINKS DAS REDES SOCIAIS
        const socialLinks = [
            { label: "facebook-icon", socialMedia: "https://www.facebook.com" },
            { label: "instagram-icon", socialMedia: "https://www.instagram.com" },
            { label: "whatsapp-icon", socialMedia: "https://www.whatsapp.com" },
            { label: "linkedin-icon", socialMedia: "https://www.linkedin.com" },
        ]

        return (
            <div className="flex flex-col gap-2">
                <h3 className="text-black text-lg font-semibold">{title}</h3>
                <ul className={"flex " + ((imgs === true) ? "flex-row gap-4 justify-center md:justify-start" : "flex-col gap-1")} >
                    {links.map((link, index) => (
                        ((imgs === true) ?
                            <li key={index}>
                                <a href={socialLinks.find((l) => l.label === link.label)?.socialMedia} className="">
                                    <img src={link.url} alt={link.label} className="w-8 h-8 object-contain" />
                                </a>
                            </li>
                            :
                            <li key={index}>
                                <a href={link.url} className="text-sm text-gray-600 dark:text-gray-400 hover:underline hover:text-primary/90">{link.label}</a>
                            </li>)
                    ))}
                </ul>
            </div>
        )
    }

    const defaultStyles = "bg-background dark:bg-white py-2 px-4 flex flex-col gap-4 rounded-lg shadow-sm";

    return (
        <footer className="w-full py-6 bg-accent text-black">
            <div className="container rounded-lg w-full max-w-6xl mx-auto gap-6 px-2 md:px-8 lg:px-0 grid grid-cols-1 lg:grid-cols-4">
                <div className={defaultStyles + " md:col-span-4 flex flex-col text-center gap-8 md:flex-row justify-between px-6! py-10!"}>
                    <FooterLinksElement
                        title="Serviços"
                        links={[
                            { label: "Aferição de pressão", url: "#" },
                            { label: "Farmácia popular", url: "#" },
                            { label: "Programas de desconto", url: "#" },
                            { label: "Aplicação de injetáveis", url: "#" },
                            { label: "Teste de glicemia", url: "#" },
                            { label: "Furo de lóbulo", url: "#" },
                        ]}
                    />
                    <FooterLinksElement
                        title="Institucional"
                        links={[
                            { label: "Nossa história", url: "#" },
                            { label: "Nossas unidades", url: "#" },
                            { label: "Trabalhe conosco", url: "#" },
                            { label: "Parcerias", url: "#" },
                        ]}
                    />
                    <FooterLinksElement
                        title="Privacidade"
                        links={[
                            { label: "Termos de uso", url: "#" },
                            { label: "Política de privacidade", url: "#" },
                            { label: "Utilização de cookies", url: "#" },
                        ]}
                    />
                    <FooterLinksElement
                        title="Redes sociais"
                        links={[
                            { label: "facebook-icon", url: "/images/icons/facebook.svg" },
                            { label: "instagram-icon", url: "/images/icons/instagram.svg" },
                            { label: "whatsapp-icon", url: "/images/icons/whatsapp.svg" },
                            { label: "linkedin-icon", url: "/images/icons/linkedin.svg" },
                        ]}
                        imgs={true}
                    />
                </div>
                <div className={defaultStyles + " md:col-span-2 py-8"}>

                    <div className="flex flex-row gap-4 items-center">

                        <Headset className="w-15 h-15" />
                        <div className="flex flex-col">
                            <span className="text-lg font-bold">Central de atendimento</span>
                            <span className="text-sm text-muted-foreground">Atendimento disponível de segunda-feira a sexta-feira,  
                                de 08:00 às 18:00.
                            </span>
                        </div>

                    </div>

                </div>
                <div className={defaultStyles + " md:col-span-2 py-8 gap-2"}>
                    <h3 className="font-bold text-lg">Formas de pagamento</h3>
                    <div className="flex flex-row gap-4 items-center">
                        <img src="/images/payments/pix.svg" alt="Pix" className="w-10 h-10 object-contain" />
                        <img src="/images/payments/amex.svg" alt="Amex" className="w-10 h-10 object-contain" />
                        <img src="/images/payments/elo.svg" alt="Elo" className="w-10 h-10 object-contain" />
                        <img src="/images/payments/visa.svg" alt="Visa" className="w-10 h-10 object-contain" />
                        <img src="/images/payments/hypercard.svg" alt="Hypercard" className="w-10 h-10 object-contain" />
                        <img src="/images/payments/dinnersClub.svg" alt="Dinners Club" className="w-10 h-10 object-contain" />
                    </div>
                </div>
                <div className={defaultStyles + " md:col-span-4 py-6"}>
                    <div className="flex flex-col items-center gap-8 md:flex-row justify-between">
                        <img src="/images/logos/camargo-red.svg" alt="Logo" className="w-50 object-contain" />
                        <span className="text-sm text-muted-foreground text-center">
                            &copy; {new Date().getFullYear()} Camargo.<br/>
                            Todos os direitos reservados.
                        </span>
                        <span>logo da vigilancia sanit</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}