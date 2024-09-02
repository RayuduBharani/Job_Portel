import { CalendarSearch, CircleAlert, IndianRupee, MapPin } from "lucide-react"
import Cookies from "js-cookie"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ChangeEvent, useEffect, useState } from "react"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"

export default function Application({ PostData }: PostData) {

    const cookie = Cookies.get("bharani") || null
    let CookieData: IcookieData | null = null
    if (cookie) {
        CookieData = JSON.parse(cookie)
    }

    const [Text, setText] = useState({
        Note: ""
    })

    interface data {
        success : boolean
    }
    const [isApplied , setIsApplied] = useState<data>()

    const [FetchData, setFetchData] = useState<Applications[]>([])
    console.log(FetchData)

    function HandleInput(event: ChangeEvent<HTMLTextAreaElement>) {
        setText((prev) => {
            return { ...prev, [event.target.name]: event.target.value }
        })
    }

    async function handleClick() {
        const response = await fetch(`http://localhost:8000/ApplyJobs/${PostData?.recruiterId._id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${CookieData?.token}`
            },
            body: JSON.stringify(Text)
        })
        const data = await response.json()
        console.log(data)
    }

    async function FetchApplicants() {
        const response = await fetch(`http://localhost:8000/getApplicats/${PostData?.recruiterId._id}`)
        const data = await response.json()
        console.log(data.success)
        setFetchData(data)
    }

    useEffect(()=>{
        fetch(`http://localhost:8000/CandidateDisabled/${PostData?._id}`)
        .then(response => response.json())
        .then((data)=>{
            setIsApplied(data)
        })
        .catch(err =>{
            console.log(err)
        })
    },[])
    console.log(isApplied)
    

    return (
        <div className="w-full h-full row-span-2 flex justify-center items-center">
            <Dialog>
                <div className="w-[70%] h-[75%] bg-secondary p-5 text-sm flex flex-col gap-3">
                    <div className="flex gap-2 items-center font-semibold"><IndianRupee size={30} className="bg-background p-2 rounded-md" />{PostData?.SalaryRange || "N/A"} </div>
                    <div className="flex gap-2 items-center font-semibold"><MapPin size={30} className="bg-background p-2 rounded-md" />{PostData?.JobType || "N/A"}</div>
                    <li className="self-center">{PostData?.Location}</li>
                    <div className="flex gap-2 items-center font-semibold"><CalendarSearch size={30} className="bg-background p-2 rounded-md" /> {PostData?.ExperienceLevel || "N/A"}</div>
                    <DialogTrigger asChild>{CookieData?.role == "candidate" ? <Button disabled={!isApplied?.success}>Apply Now</Button> : <Button onClick={FetchApplicants}>Applicants</Button>}</DialogTrigger>
                    <div className="flex gap-2 items-center font-semibold"><CircleAlert size={17} /><p className="text-xs text-neutral-500 text-center">Last Date {PostData?.ApplicationDeadline}</p></div>
                </div>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{CookieData?.role == "candidate" ? `Apply to ${PostData?.CompanyName}` : "Applicants"}</DialogTitle>
                        <DialogDescription>
                            {CookieData?.role === "candidate" ? (
                                <>
                                    <Textarea
                                        onChange={HandleInput}
                                        name="Note"
                                        className="mt-10"
                                        placeholder="Tell me about yourself ..."
                                    />
                                    <Button onClick={handleClick} className="w-full mt-5">
                                        Send
                                    </Button>
                                </>
                            ) : (
                                <div className="w-full h-full py-5 overflow-y-scroll hide-scrollbar">
                                    {
                                        FetchData &&
                                        FetchData.map((item, index) => {
                                            return (
                                                <div key={index} className="w-full h-fit flex  justify-between p-3 shadow-sm bg-muted mt-3">
                                                    <h1 className="font-bold text-foreground content-center">{item.candidateId.fullName}</h1>
                                                    <Button>View Profile</Button>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}
