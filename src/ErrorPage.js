import {useTranslation} from "react-i18next";

export default function ErrorPage()
{
    const { t } = useTranslation();

    return <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-100">
        <img src="/error404.png" width={347} alt=""/>
        <div className="text-7xl mt-16 font-black text-gray-400">{t('errorPage.title')}</div>
        <div className="text-2xl mt-6">{t('errorPage.content')}</div>
    </div>
}
