export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `try{const t=localStorage.getItem('theme')||'dark';document.documentElement.classList.toggle('dark',t==='dark');}catch(e){}`,
      }}
    />
  );
}
