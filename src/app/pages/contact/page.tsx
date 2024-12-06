"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  faYoutube,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { Footer } from "../../components/Footer";
import { FaArrowLeft } from "react-icons/fa6";
import { useRouter } from "@/src/navigation";
import { RiFacebookCircleLine } from "react-icons/ri";
import { AiOutlineLinkedin } from "react-icons/ai";
import { MdOutlineEmail } from "react-icons/md";

export default function Contact() {


  const router = useRouter();

  function handleBack() {
    router.back();
  }

  const handleEmailClick = () => {
    navigator.clipboard.writeText("pedrohfsilva@usp.br");
    alert("Email copiado para sua área de transferência :)");
  };

  const buttonStyle = {
    boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.1)", // Sombra mais suave
    fontSize: "20px", // Tamanho do texto para mobile
    backgroundColor: "var(--background-secondary)", // Usando variável CSS
    color: "var(--primary)", // Usando variável CSS para o texto
  };

  const iconStyle = {
    fontSize: "28px", // Tamanho do ícone para mobile
    marginRight: "12px",
    color: "var(--primary)", // Usando variável CSS para o ícone
  };

  return (
    <div className="p-8 text-center mt-16 relative">
      <button onClick={handleBack} className="h-12 w-12 flex justify-center items-center hover:bg-black/5 rounded-full transition duration-500 absolute left-4 md:left-8 top-4" aria-label="Voltar">
        <FaArrowLeft size={24} color={"var(--marine)"} />
      </button>
      <div className="w-full max-w-screen-md mx-auto mt-8">
        <p className="text-2xl md:text-3xl mb-10 md:mb-16">
          {"Entre em contato conosco para saber mais sobre o MeGuie. Estamos sempre abertos a novas ideias, parcerias e colaborações."}
        </p>
        <div
          className="flex flex-col md:flex-row justify-center space-y-6 md:space-y-0 md:space-x-10"
          style={{ marginBottom: "50px" }} // Adiciona espaço inferior antes do footer
        >
          <button
            onClick={handleEmailClick}
            className="w-full md:w-auto px-6 py-4 md:px-8 md:py-6 rounded-3xl shadow-lg flex items-center justify-center whitespace-nowrap"
            style={buttonStyle}
            aria-label="Copiar email"
          >
            <MdOutlineEmail style={iconStyle} />
            E-mail
          </button>
          <button
            onClick={() =>
              window.open("https://instagram.com/", "_blank")
            }
            className="w-full md:w-auto px-6 py-4 md:px-8 md:py-6 rounded-3xl shadow-lg flex items-center justify-center whitespace-nowrap"
            style={buttonStyle}
            aria-label="Abrir Instagram"
          >
            <FontAwesomeIcon icon={faInstagram} style={iconStyle} />
            Instagram
          </button>
          <button
            onClick={() =>
              window.open(
                "https://www.linkedin.com/school/",
                "_blank"
              )
            }
            className="w-full md:w-auto px-6 py-4 md:px-8 md:py-6 rounded-3xl shadow-lg flex items-center justify-center whitespace-nowrap"
            style={buttonStyle}
            aria-label="Abrir LinkedIn"
          >
            <AiOutlineLinkedin style={iconStyle} />
            LinkedIn
          </button>
          <button
            onClick={() =>
              window.open(
                "https://www.facebook.com",
                "_blank"
              )
            }
            className="w-full md:w-auto px-6 py-4 md:px-8 md:py-6 rounded-3xl shadow-lg flex items-center justify-center whitespace-nowrap"
            style={buttonStyle}
            aria-label="Abrir LinkedIn"
          >
            <RiFacebookCircleLine style={iconStyle} />
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
}
