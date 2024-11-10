"use client";

import React from "react";
import LoadingOverlay from "../../components/LoadingOverlay";
import Button from "../../components/Button";
import { useRouter } from "next/navigation";

const inputClassName = "p-2 pl-3 border rounded-full border-gray-500 text-gray-600 bg-background-primary placeholder-gray-700";

const errorInputClassName = "p-2 pl-3 border rounded-full border-red-500 text-gray-600 bg-background-primary placeholder-red-500";

const errorTextClassName = "text-red-500 text-xs -mt-1";

export default function SignUp() {

    const router = useRouter();

    const [loading, setLoading] = React.useState(false);

    const [formData, setFormData] = React.useState({
        name: '', email: '', password: '', confirm: '',
    });

    const [errors, setErrors] = React.useState({
        name: '', email: '', password: '', confirm: '',
    });

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const validateFormData = (): boolean => {
        const newErrors = {
            name: '', email: '', password: '', confirm: '',
        };

        if (!formData.name) newErrors.name = 'Nome é obrigatório.';

        if (!formData.email) {
            newErrors.email = 'E-mail é obrigatório.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Formato de e-mail inválido.';
        }
        
        if (!formData.password) newErrors.password = 'Senha é obrigatória.';
        
        if (!formData.confirm) {
            newErrors.confirm = 'Confirmação de Senha é obrigatória.';
        } else if (formData.confirm !== formData.password) {
            newErrors.confirm = 'As senhas não coincidem.';
        }

        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === '');
    }

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateFormData()) return;

        // todo: make request and set loading ... 

        // ok!
        router.push('/br/pages/login');
    }

    const handleNavigation = () => {
        router.push('/br/pages/login');
    }

    return (
        <div className="mt-28 mb-5 w-[250px] md:w-[350px]">
            {loading ? (
                <div className="transition-opacity duration-500 opacity-100">
                    <LoadingOverlay />
                </div>
            ) 
            :
            <div className="flex flex-col gap-y-3">
                <p>Insira as suas informações:</p>
                    
                <input // todo: add icons :)
                    type="text" name="name"
                    placeholder="Nome Completo"
                    aria-label="Nome Completo"
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={errors.name ? errorInputClassName : inputClassName}
                    value={formData.name}
                    onChange={handleFormChange}
                />
                {errors.name && 
                    <p id="name-error" className={errorTextClassName}>
                        {errors.name}
                    </p>
                }
                <input
                    type="text" name="email"
                    placeholder="E-mail"
                    aria-label="E-mail"
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={errors.email ? errorInputClassName : inputClassName}
                    value={formData.email}
                    onChange={handleFormChange}
                />
                {errors.email && 
                    <p id="email-error" className={errorTextClassName}>
                        {errors.email}
                    </p>
                }
                <input
                    type="password" name="password"
                    placeholder="Senha"
                    aria-label="Senha"
                    aria-describedby={errors.password ? "password-error" : undefined}
                    className={errors.password ? errorInputClassName : inputClassName}
                    value={formData.password}
                    onChange={handleFormChange}
                />
                {errors.password && 
                    <p id="password-error" className={errorTextClassName}>
                        {errors.password}
                    </p>
                }
                <input
                    type="password" name="confirm"
                    placeholder="Confirmar Senha"
                    aria-label="Confirmar Senha"
                    aria-describedby={errors.confirm ? "confirm-error" : undefined}
                    className={errors.confirm ? errorInputClassName : inputClassName}
                    value={formData.confirm}
                    onChange={handleFormChange}
                />
                {errors.confirm && 
                    <p id="confirm-error" className={errorTextClassName}>
                        {errors.confirm}
                    </p>
                }

                <Button variant="secondary" size="medium" 
                    onClick={handleFormSubmit} type="submit"
                    className="mt-5"
                    aria-label="Cadastrar nova conta"
                >
                    Cadastrar
                </Button>

                <p className="mt-5 text-sm text-center">
                    <span>Já tem uma conta? </span>
                    <a className="text-data-purple cursor-pointer underline"
                        onClick={handleNavigation} role="link"
                        aria-label="Ir para a página de login"
                        tabIndex={0} // for a11y
                    >
                        Fazer Login
                    </a>
                </p>
            </div>
            }
        </div>
    )
}