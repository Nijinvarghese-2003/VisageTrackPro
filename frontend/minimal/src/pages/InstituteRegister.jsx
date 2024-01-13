import { Helmet } from 'react-helmet-async';

import { InstituteView } from 'src/sections/register';

// ----------------------------------------------------------------------

export default function RegisterPage() {
    return (
        <>
            <Helmet>
                <title> Register | Minimal UI </title>
            </Helmet>

            <InstituteView />
        </>
    );
}
