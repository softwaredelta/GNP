import { FiEdit } from "react-icons/fi";
import { IStatus } from "../../types";

export interface ProspectsCardProps {
    id: string;
    name: string;
    firstSurname: string;
    secondSurname: string;
    prospectStatus:{
        status: IStatus;
        statusComment: string;
    }[]
    
}

export default function RowProspect({  
    id,
    name, 
    firstSurname, 
    secondSurname,
    prospectStatus,

    }: ProspectsCardProps): JSX.Element {

        const colorOptions : { [key: string]: string } = {
            "Nuevo prospecto": "bg-gnp-blue-500",
            "Cita agendada": "bg-gnp-orange-500",
            "Cita efectiva": "bg-purple-500",
            "Solicitud de seguro": "bg-yellow-500",
            "Poliza pagada": "bg-green-500",
            "Retirado": "bg-red-500",
        };
        return (
            <div className="grid w-10/12 mx-auto mt-5 grid-cols-1 overflow-hidden rounded bg-gnp-white  shadow-lg transition-all ease-in-out hover:scale-110 ">
                <div className="grid grid-cols-8 border-black/20">
                    <div className="col-span-2 h-full py-4 px-4 w-full flex items-center justify-center">
                        {name} {firstSurname} {secondSurname}
                    </div>

                    <div className="flex space-x-6 items-center border-black/10 border-l-2 h-full py-4 px-4 justify-end">
                        <div>{prospectStatus[0].status.statusName}</div>
                    </div> 

                    <div className="flex space-x-6 py-4 px-4 justify-center">
                        <div className={`w-8 h-8 ${colorOptions[prospectStatus[0].status.statusName]} rounded-full`}></div>
                    </div>

                    <div className="border-l-2 col-span-3 h-full py-4 px-4 flex border-black/10 items-center justify-center">
                        {prospectStatus[0].statusComment}
                    </div>

                    <div className="border-l-2 h-full py-4 px-4 flex border-black/10 items-center justify-center ">
                        <button className="mr-2 cursor-pointer transition-all ease-in-out hover:scale-125"> <FiEdit className="text-2xl"/> </button>
                    </div>
                </div>
            </div>
    );
}
