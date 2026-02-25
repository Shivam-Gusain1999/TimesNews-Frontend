import { useState, useEffect } from 'react';
import { settingApi } from '../api/settingApi';

const AdSlot = ({ type, className = '' }) => {
    const [adHtml, setAdHtml] = useState(null);

    useEffect(() => {
        const fetchAd = async () => {
            try {
                // Fetch all ads
                const res = await settingApi.getSettings('ads');
                if (res.data && res.data[type]) {
                    setAdHtml(res.data[type]);
                }
            } catch (error) {
                // Silently fail if ad block is detected or API fails
            }
        };

        fetchAd();
    }, [type]);

    if (!adHtml) return null;

    return (
        <div
            className={`w-full overflow-hidden flex justify-center items-center ${className}`}
            dangerouslySetInnerHTML={{ __html: adHtml }}
        />
    );
};

export default AdSlot;
