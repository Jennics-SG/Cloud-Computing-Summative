export function getAccess(){
    return JSON.parse(localStorage.getItem('access'));
}

export async function validateToken(){
    const token = getAccess();

    const response = await fetch('../../auth/validateToken',{
        'method': 'POST',
        headers: {
            'Content-Type': 'application/JSON'
        },
        body: JSON.stringify({token})
    });

    if(response.status != 200) return response.status;

    const data = await response.json();

    return data.data;
}

export async function genToken(cb){
    const response = await fetch('../../auth/createToken', {
        'method': 'POST',
        headers: {
            'Content-Type': 'application/JSON'
        }
    });

    if(response.status !== 200){
        window.location.href = '../../lsu/'
        return;
    }

    // Put new access in local
    localStorage.setItem('access', JSON.stringify(await response.json()));
    
    // If user needs to get rerun fetch function with new access
    if(cb)
        return cb()
    return;
}

