/**
 * Simple class to handle listening and reacting to events
 * @returns 
 */
const Events = () => {
    const listeners =  new Map<String, Function>();
    /**
     * Register an event handler
     * @param evt 
     * @param callback 
     */
    const on = (evt:string, callback) => {
        listeners.set(evt, callback);
    };
    /**
     * Send an event to handler
     * @param evt 
     * @param data 
     */
    const send = (evt:string, data) => {
        const callback = listeners.get(evt);
        if(callback){
            callback(data);
        }else{
            console.error('no callback available, cannot forward event');
        }
    }
    return {
        on:on,
        send:send
    }
};
export default Events;