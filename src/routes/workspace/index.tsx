import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import styles from "./workspace.module.css";

const WS_URL = "wss://8ucugo4pei.execute-api.us-east-1.amazonaws.com/prod";

export default component$(() => {
  const token = useSignal("");
  const connected = useSignal(false);
  const isOwner = useSignal(false);
  const messages = useSignal<{ from: string; text: string; timestamp: string }[]>([]);
  const input = useSignal("");
  const status = useSignal<"idle" | "connecting" | "connected" | "error">("idle");
  const ws = useSignal<WebSocket | null>(null);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    cleanup(() => ws.value?.close());
  });

  const connect = $(() => {
    if (!token.value.trim()) return;
    status.value = "connecting";

    const socket = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token.value)}`);

    socket.onopen = () => {
      connected.value = true;
      status.value = "connected";
      ws.value = socket;
    };

    socket.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.from === "owner") isOwner.value = true;
        messages.value = [...messages.value, msg];
      } catch {}
    };

    socket.onerror = () => {
      status.value = "error";
      connected.value = false;
    };

    socket.onclose = () => {
      connected.value = false;
      if (status.value === "connected") status.value = "idle";
      ws.value = null;
    };
  });

  const send = $(() => {
    if (!input.value.trim() || !ws.value) return;
    ws.value.send(JSON.stringify({ action: "message", text: input.value }));
    input.value = "";
  });

  return (
    <div class={styles.page}>
      {!connected.value ? (
        <div class={styles.gate}>
          <div class={styles.gateCard}>
            <h1>Client Workspace</h1>
            <p>This workspace is for active clients with a signed engagement. Enter your access token to connect.</p>
            <p class={styles.freeConsult}>
              No token yet? Start with a <a href="/contact/">free consult via email</a> and we'll take it from there.
            </p>
            <div class={styles.tokenForm}>
              <input
                type="password"
                placeholder="Access token"
                value={token.value}
                onInput$={(e) => token.value = (e.target as HTMLInputElement).value}
                onKeyDown$={(e) => e.key === "Enter" && connect()}
                class={styles.tokenInput}
              />
              <button
                onClick$={connect}
                disabled={status.value === "connecting"}
                class={styles.connectBtn}
              >
                {status.value === "connecting" ? "Connecting…" : "Connect"}
              </button>
            </div>
            {status.value === "error" && (
              <p class={styles.error}>Invalid token or workspace is currently offline.</p>
            )}
          </div>
        </div>
      ) : (
        <div class={styles.workspace}>
          <div class={styles.workspaceHeader}>
            <span class={styles.statusDot} />
            <span>{isOwner.value ? "Owner" : "Client"}: Connected</span>
          </div>
          <div class={styles.messages}>
            {messages.value.length === 0 && (
              <p class={styles.empty}>No messages yet. Send one to get started.</p>
            )}
            {messages.value.map((m, i) => (
              <div key={i} class={[styles.message, m.from === "owner" ? styles.fromOwner : styles.fromClient]}>
                <span class={styles.msgMeta}>{m.from} · {new Date(m.timestamp).toLocaleTimeString()}</span>
                <p>{m.text}</p>
              </div>
            ))}
          </div>
          <div class={styles.inputRow}>
            <input
              type="text"
              placeholder="Type a message…"
              value={input.value}
              onInput$={(e) => input.value = (e.target as HTMLInputElement).value}
              onKeyDown$={(e) => e.key === "Enter" && send()}
              class={styles.msgInput}
            />
            <button onClick$={send} class={styles.sendBtn}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Client Workspace | Q2 Computing",
  meta: [
    {
      name: "description",
      content: "Secure real-time workspace for active Q2 Computing clients.",
    },
    {
      name: "robots",
      content: "noindex",
    },
  ],
};
