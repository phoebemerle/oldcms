import {event} from '@/services';

export function forceReloadWindow() {
    window.onbeforeunload = function () {};
    window.location.reload();
}

export function loadMainContent(view, subView, ...args) {
    event.emit(event.names.LOAD_MAIN_CONTENT, view, subView, ...args);
    event.emit(event.names.LOAD_TAB, subView);
}
