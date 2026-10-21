import React from "react";
export default function PageShell({ title, description = "This section is ready to be connected to the API." }) { return <main className="page-state"><h1>{title}</h1><p>{description}</p></main>; }
