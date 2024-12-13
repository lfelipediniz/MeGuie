// /pages/signup.tsx

"use client";

import React, { useState } from "react";
import LoadingOverlay from "../../components/LoadingOverlay";
import TopicsModal from "../../components/TopicsModal";
import { useRouter } from "next/navigation";

import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const inputClassName =
  "p-2 pl-11 border rounded-full border-gray-500 text-gray-600 bg-background-primary placeholder-gray-700 w-full";
const errorInputClassName =
  "p-2 pl-11 border rounded-full border-red-500 text-gray-600 bg-background-primary placeholder-red-500 w-full";
const errorTextClassName = "text-red-500 text-xs -mt-1";

export default function SignUp() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
  });

  const openModal = (title: string, description: string) => {
    setModalContent({ title, description });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateFormData = (): boolean => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirm: "",
    };

    if (!formData.name) newErrors.name = "Nome é obrigatório.";

    if (!formData.email) {
      newErrors.email = "E-mail é obrigatório.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Formato de e-mail inválido.";
    }

    if (!formData.password) newErrors.password = "Senha é obrigatória.";

    if (!formData.confirm) {
      newErrors.confirm = "Confirmação de Senha é obrigatória.";
    } else if (formData.confirm !== formData.password) {
      newErrors.confirm = "As senhas não coincidem.";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFormData()) return;
  
    setLoading(true);
  
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
  
      const data = await response.json();
      console.log('Resposta da API:', data); // Adicione este log para depuração
  
      if (response.ok) {
        // Salva o token no Local Storage
        localStorage.setItem("authToken", data.token);
  
        // Redireciona para a página inicial e recarrega a página
        window.location.href = "/";
      } else {
        openModal("Erro no Cadastro", data.message);
      }
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      openModal(
        "Erro no Cadastro",
        "Ocorreu um erro ao tentar cadastrar. Por favor, tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = () => {
    router.push("/pages/login"); // Ajuste o caminho conforme necessário
  };

  return (
    <div className="mt-28 mb-10 mx-auto w-[250px] md:w-[350px]">
      {loading ? (
        <div className="transition-opacity duration-500 opacity-100">
          <LoadingOverlay />
        </div>
      ) : (
        <form className="flex flex-col gap-y-3" onSubmit={handleFormSubmit}>
          <p>Insira as suas informações:</p>

          <div className="relative flex items-center">
            <span className="absolute left-3 text-gray-400">
              <PersonOutlineIcon className={errors.name ? "text-red-500" : ""} />
            </span>
            <input
              type="text"
              name="name"
              placeholder="Nome Completo"
              className={errors.name ? errorInputClassName : inputClassName}
              value={formData.name}
              onChange={handleFormChange}
            />
          </div>
          {errors.name && <p className={errorTextClassName}>{errors.name}</p>}

          <div className="relative flex items-center">
            <span className="absolute left-3 text-gray-400">
              <MailOutlineIcon className={errors.email ? "text-red-500" : ""} />
            </span>
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              className={errors.email ? errorInputClassName : inputClassName}
              value={formData.email}
              onChange={handleFormChange}
            />
          </div>
          {errors.email && <p className={errorTextClassName}>{errors.email}</p>}

          <div className="relative flex items-center">
            <span className="absolute left-3 text-gray-400">
              <LockOutlinedIcon className={errors.password ? "text-red-500" : ""} />
            </span>
            <input
              type="password"
              name="password"
              placeholder="Senha"
              className={errors.password ? errorInputClassName : inputClassName}
              value={formData.password}
              onChange={handleFormChange}
            />
          </div>
          {errors.password && <p className={errorTextClassName}>{errors.password}</p>}

          <div className="relative flex items-center">
            <span className="absolute left-3 text-gray-400">
              <LockOutlinedIcon className={errors.confirm ? "text-red-500" : ""} />
            </span>
            <input
              type="password"
              name="confirm"
              placeholder="Confirmar Senha"
              className={errors.confirm ? errorInputClassName : inputClassName}
              value={formData.confirm}
              onChange={handleFormChange}
            />
          </div>
          {errors.confirm && <p className={errorTextClassName}>{errors.confirm}</p>}

          <button
            type="submit"
            className="px-4 py-2 mt-5 rounded-lg hover:opacity-90"
            style={{
              backgroundColor: "var(--action)",
              color: "var(--background)",
            }}
            aria-label="Cadastrar nova conta"
          >
            Cadastrar
          </button>

          <p className="mt-5 text-sm text-center">
            <span>Já tem uma conta? </span>
            <a
              className="cursor-pointer underline"
              style={{ color: "var(--action)" }}
              onClick={handleNavigation}
            >
              Fazer Login
            </a>
          </p>
        </form>
      )}

      <TopicsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalContent.title}
        topics={[{ title: modalContent.title, description: modalContent.description }]}
      />
    </div>
  );
}
