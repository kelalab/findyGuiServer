/**
 * Checks that inputted args exists and are not empty strings and returns the first that satisfies this.
 * @param args array of args in order of importance
 * @returns first arg that is not null and lenght > 0
 */
export const determinePort = (...args) => {
    for(const arg of args){
        console.log(arg);
        if(arg && arg.length>0){
            return arg;
        }
    }
    return '';
}