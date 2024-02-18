/** Name:   WaglyJs.frontend.tokens.js
 *  Desc:   Token logic for frontend
 *  Author: Jimy Houlbrook
 *  Date:   18/02/24
 */

/** Get the access token from local storage
 * 
 * @returns access token
 */
export function getAccess(){
    return JSON.parse(localStorage.getItem('access'));
}

/** Validate token with API call
 * 
 * @returns HTTP respose if unauthorised.
 *          Data from token if authorised
 */
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

/** Get new access key with API call
 * 
 * @param {CallableFunction} cb Callback function to use if needing to
 *                              revalidate auth to do API call 
 * @returns cb || Nothing
 */
export async function genToken(cb){
    const response = await fetch('../../auth/createToken', {
        'method': 'POST',
        headers: {
            'Content-Type': 'application/JSON'
        }
    });

    // Redirect user to login if refresh is expired
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

