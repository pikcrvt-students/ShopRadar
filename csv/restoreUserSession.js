async function restoreUserSession() {
    try {
        const res = await fetch('/api/me');
        const data = await res.json();

        if (data.ok) {
            setCurrentUser(data.user);
        } else {
            setCurrentUser(null);
        }
    } catch {
        setCurrentUser(null);
    }

    updateProfileUI();
}