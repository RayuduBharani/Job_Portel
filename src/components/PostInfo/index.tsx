import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Separator } from "../ui/separator"

import Application from "../Application"


export default function PostInfo() {
    const data = useParams()

    const [PostData, setPostData] = useState<IrecruiterJobData>()

    async function FetchJobDetailes() {
        try {
            const response = await fetch(`http://localhost:8000/findjob/${data.name}`);
            const ShowDetailes = await response.json();
            setPostData(ShowDetailes.data);
            console.log(ShowDetailes.data)
        }
        catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        FetchJobDetailes()
    }, [])

    return (
        <div className="w-full h-screen pt-[75px] flex justify-center items-center">
            <div className="w-[85%] h-[90%] grid grid-cols-3 p-2 grid-rows-3">
                <div className="w-full h-full col-span-2">
                    <img className="w-fit h-[80px] rounded-md" src={PostData?.recruiterId.companyLogo} alt="" />
                    <p className="font-semibold text-2xl pt-4">{PostData?.JobTitle}</p>
                    <p className="font-semibold text-neutral-600 pt-3">{PostData?.recruiterId?.currentCompany}</p>
                    <Separator className="mt-3" />
                </div>

                <Application PostData={PostData} />

                <div className="w-full h-full col-span-2 row-span-1 py-5">
                    <p className="font-medium text-xl pt-2">Job Description</p>
                    <p className="pt-3 text-neutral-500">{PostData?.JobDescription}</p>
                    <ul className="w-full h-full flex gap-4 py-10">
                        {
                            PostData?.RequiredSkills.map((skill, index) => {
                                return <li key={index} className="bg-secondary w-fit h-fit px-3 py-1 rounded-lg">{skill}</li>
                            })
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}
