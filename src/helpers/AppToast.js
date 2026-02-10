import { toast } from "react-toastify";

const toastOptions = {
    // style: { backgroundColor: "red" },
    position: "top-right",
    autoClose: 5000,

    // hideProgressBar: false,
    // closeOnClick: true,
    // pauseOnHover: true,
    // draggable: true,
    // progress: undefined,
    theme: "light",
};

export const showFaliureToast = (message, autoClose = 5000) => {
    try{

        toast.dismiss()
        const options = {...toastOptions,autoClose : autoClose};
        toast.error(<div dangerouslySetInnerHTML={{ __html: message }} />, options);
    }catch(err){
        console.log('this is  err======',err)
    }
};

export const showSuccessToast = (message, autoClose = 5000) => {
    try {
        toast.dismiss()
        const options = {...toastOptions, autoClose : autoClose};
        toast.success(message ?? "success", options);
    } catch (err) {
        console.log('this is err on toast-------', err)
    }
};
