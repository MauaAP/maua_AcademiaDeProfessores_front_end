import { IoIosDownload } from "react-icons/io";

export function CorpoDownloadRelatorio(){
    return (
        <section className='p-24 max-md:p-8'>
            <div className="flex justify-between lg:items-center gap-4 max-lg:flex-col">
                <h2 className="text-2xl font-semibold text-[#4F1313] max-lg:text-center">Relatórios</h2>
            </div>

            <div className="flex flex-col justify-center items-center gap-8 mt-8">
                <div className="flex items-center justify-between p-8 bg-gray-300 w-1/2 rounded-xl shadow-md">
                    <div>
                        <h3 className="text-lg font-semibold text-[#4F1313]">Download Relatório de Certificados</h3>
                        <p className="text-sm text-[#4F1313]">Baixe o relatório de certificados em PDF.</p>
                    </div>
                    <button className="flex items-center justify-between gap-2 bg-[#69A120] text-white p-2 rounded-lg duration-100 hover:bg-[#517e17] max-md:justify-center">Baixar <IoIosDownload size={16}/></button>
                </div>
                <div className="flex items-center justify-between p-8 bg-gray-300 w-1/2 rounded-xl shadow-md">
                    <div>
                        <h3 className="text-lg font-semibold text-[#4F1313]">Download Relatório de Certificados</h3>
                        <p className="text-sm text-[#4F1313]">Baixe o relatório de certificados em PDF.</p>
                    </div>
                    <button className="flex items-center justify-between gap-2 bg-[#69A120] text-white p-2 rounded-lg duration-100 hover:bg-[#517e17] max-md:justify-center">Baixar <IoIosDownload size={16}/></button>
                </div>
                <div className="flex items-center justify-between p-8 bg-gray-300 w-1/2 rounded-xl shadow-md">
                    <div>
                        <h3 className="text-lg font-semibold text-[#4F1313]">Download Relatório de Certificados</h3>
                        <p className="text-sm text-[#4F1313]">Baixe o relatório de certificados em PDF.</p>
                    </div>
                    <button className="flex items-center justify-between gap-2 bg-[#69A120] text-white p-2 rounded-lg duration-100 hover:bg-[#517e17] max-md:justify-center">Baixar <IoIosDownload size={16}/></button>
                </div>
            </div>
        </section>
    )
}