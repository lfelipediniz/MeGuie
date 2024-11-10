"use client";

import React from "react";
import LoadingOverlay from "../../components/LoadingOverlay";
import Button from "../../components/Button";
import { useRouter } from "next/navigation";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const inputClassName = "p-2 pl-11 border rounded-full border-gray-500 text-gray-600 bg-background-primary placeholder-gray-700 w-full";

const errorInputClassName = "p-2 pl-11 border rounded-full border-red-500 text-gray-600 bg-background-primary placeholder-red-500 w-full";

const errorTextClassName = "text-red-500 text-xs -mt-1";

export default function Login() {

    const router = useRouter();

    const [loading, setLoading] = React.useState(false);

    const [formData, setFormData] = React.useState({
        email: '', password: '',
    });

    const [errors, setErrors] = React.useState({
        email: '', password: '',
    });

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const validateFormData = (): boolean => {
        const newErrors = {
            email: '', password: '',
        };

        if (!formData.email) {
            newErrors.email = 'E-mail é obrigatório.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Formato de e-mail inválido.';
        }
        
        if (!formData.password) newErrors.password = 'Senha é obrigatória.';
        
        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === '');
    }

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateFormData()) return;

        // todo: make request and set loading ... 

        // ok!
        router.push('/br'); // todo: change to roadmap page
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
                
                <div className="relative flex items-center">
                    <span className="absolute left-3 text-gray-400">
                        <MailOutlineIcon 
                            className={errors.email ? 'text-red-500' : ''}
                        />
                    </span>
                    <input
                        type="text"
                        name="email"
                        placeholder="E-mail"
                        aria-label="E-mail"
                        aria-describedby={errors.email ? "email-error" : undefined}
                        className={`${errors.email ? errorInputClassName : inputClassName} pl-10`}
                        value={formData.email}
                        onChange={handleFormChange}
                    />
                </div>
                {errors.email && 
                    <p id="email-error" className={errorTextClassName}>
                        {errors.email}
                    </p>
                }

                <div className="relative flex items-center">
                    <span className="absolute left-3 text-gray-400">
                        <LockOutlinedIcon 
                            className={errors.password ? 'text-red-500' : ''}
                        />
                    </span>
                    <input
                        type="password" name="password"
                        placeholder="Senha"
                        aria-label="Senha"
                        aria-describedby={errors.password ? "password-error" : undefined}
                        className={errors.password ? errorInputClassName : inputClassName}
                        value={formData.password}
                        onChange={handleFormChange}
                    />
                </div>
                {errors.password && 
                    <p id="password-error" className={errorTextClassName}>
                        {errors.password}
                    </p>
                }

                <Button variant="secondary" size="medium" 
                    onClick={handleFormSubmit} type="submit"
                    className="mt-5"
                    aria-label="Entrar na conta"
                >
                    Entrar
                </Button>
            </div>
            }
        </div>
    )
}