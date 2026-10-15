import { Headset } from "lucide-react";
import { companyConfig } from "@/lib/company";

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
                <h3 className="text-black dark:text-white text-lg font-semibold">{title}</h3>
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
                                <a href={link.url} className="text-sm text-muted-foreground hover:underline hover:text-primary/90">{link.label}</a>
                            </li>)
                    ))}
                </ul>
            </div>
        )
    }

    const defaultStyles = "bg-background dark:bg-white py-2 px-4 flex flex-col gap-4 rounded-lg shadow-sm";

    return (
        <footer className="w-full py-6 bg-accent text-black">
            <div className="rounded-lg w-full max-w-6xl mx-auto gap-6 px-2 md:px-8 lg:px-0 grid grid-cols-1 lg:grid-cols-4">

                <div className="bg-background dark:bg-gray-800 rounded-lg shadow-sm w-full md:col-span-4 text-center flex flex-col md:flex-row gap-8 justify-between px-6 py-10">
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
                            { label: "Nossa história", url: "/about" },
                            { label: "Nossas unidades", url: "#" },
                            { label: "Trabalhe conosco", url: "#" },
                            { label: "Parcerias", url: "#" },
                        ]}
                    />
                    <FooterLinksElement
                        title="Privacidade"
                        links={[
                            { label: "Termos de uso", url: "/terms" },
                            { label: "Política de Trocas e Devoluções", url: "/returns" },
                            { label: "Política de Privacidade", url: "/privacity" },
                            { label: "Política de Cookies", url: "/cookies" },
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

                <div className={"flex items-center shadow-sm flex-1 bg-background dark:bg-gray-800 dark:text-white rounded-lg p-4 md:col-span-2 lg:col-span-2"}>

                    <div className="flex flex-row gap-4">

                        <Headset className="w-15 h-15" />

                        <div className="flex flex-col">
                            <span className="text-lg font-bold">Central de atendimento</span>
                            <span className="text-sm text-muted-foreground">Atendimento disponível de segunda-feira a sexta-feira,
                                de 08:00 às 18:00.
                            </span>
                        </div>

                    </div>

                </div>

                <div className={"bg-background dark:bg-gray-800 rounded-lg p-4 shadow-sm flex flex-col gap-2 md:col-span-2"}>
                    <h3 className="font-bold text-lg dark:text-white">Formas de pagamento</h3>
                    <div className="grid grid-cols-3 md:flex md:justify-around flex-row gap-4 justify-items-center items-center">
                        <img src="/images/payments/pix.svg" alt="Pix" className="w-10 h-10 object-contain" />
                        <img src="/images/payments/amex.svg" alt="Amex" className="w-10 h-10 object-contain" />
                        <img src="/images/payments/elo.svg" alt="Elo" className="w-10 h-10 object-contain" />
                        <img src="/images/payments/visa.svg" alt="Visa" className="w-10 h-10 object-contain" />
                        <img src="/images/payments/hypercard.svg" alt="Hypercard" className="w-10 h-10 object-contain" />
                        <img src="/images/payments/dinnersClub.svg" alt="Dinners Club" className="w-10 h-10 object-contain" />
                    </div>
                </div>

                <div className={`bg-background dark:bg-gray-800 rounded-lg px-4 shadow-sm lg:col-span-4 py-8 mb-4`}>
                    <div className="flex flex-col items-center gap-6 md:flex-row justify-between w-full border-b border-gray-200 pb-6 mb-4">
                        <img src="/images/logos/camargo-red.svg" alt={companyConfig.name} className="w-40 object-contain" />

                        <span className="text-sm text-muted-foreground text-center">
                            &copy; {new Date().getFullYear()} {companyConfig.name} - Todos os direitos reservados.
                        </span>


                        <div className="flex gap-4 items-center justify-center md:justify-end">
                            <div className="h-10 w-28 bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded">
                                Selo Anvisa
                            </div>
                        </div>
                    </div>

                    <div className="text-[11px] leading-tight text-muted-foreground text-justify md:text-center w-full px-2">
                        <p className="mb-1">
                            <strong>{companyConfig.name}</strong> | CNPJ: {companyConfig.cnpj} | Inscrição Estadual: {companyConfig.stateRegistration} | Endereço: {companyConfig.address}
                        </p>
                        <p className="mb-1">
                            <strong>Farmacêutico Responsável:</strong> {companyConfig.legal.farmaceutico} - CRF/UF: {companyConfig.legal.crf} | <strong>AFE:</strong> {companyConfig.legal.afe} | <strong>Alvará Sanitário:</strong> {companyConfig.legal.alvara}
                        </p>
                        <p className="italic mt-2">
                            As informações contidas neste site não devem ser usadas para automedicação e não substituem, em hipótese alguma, as orientações dadas pelo profissional da área médica. Somente o médico está apto a diagnosticar qualquer problema de saúde e prescrever o tratamento adequado. Ao persistirem os sintomas, um médico deverá ser consultado.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}