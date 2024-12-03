"use client";
import { useSearchParams } from "next/navigation"; // Importa o hook useSearchParams
import { useRouter } from "@/src/navigation";
import { FaArrowLeft } from "react-icons/fa6";

export default function YouTubeVideo() {
  const searchParams = useSearchParams(); // Obtém os parâmetros de consulta
  const videoId = searchParams.get('videoId'); // Acessa o parâmetro 'videoId'
  const section = searchParams.get('section'); // Acessa o parâmetro 'section'
  const router = useRouter()

  function handleBack() {
    router.back()
  }

  return (
    <div className="text-xl md:text-2xl mt-[4.5rem] md:mt-16 px-4 md:px-8 py-8 flex flex-col items-center relative">
      <button onClick={handleBack} className="h-12 w-12 flex justify-center items-center hover:bg-black/5 rounded-full transition duration-500 absolute left-4 md:left-8 top-4" aria-label="Voltar">
        <FaArrowLeft size={24} color={"var(--marine)"} />
      </button>
      {(videoId && section) ? (
        <>
        <div>

          <h2 className="text-center mb-4">{section}</h2>
        </div>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`} // Usando o videoId passado como parâmetro
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          className="w-full max-w-screen-md aspect-video"
          aria-label="Player de vídeo do YouTube"
        ></iframe>
        </>
      ) : (
        <p className="text-red-600 text-xl">Vídeo não disponível</p>
      )}
    </div>
  );
}
