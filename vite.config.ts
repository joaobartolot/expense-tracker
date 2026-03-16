import { networkInterfaces } from 'node:os';
import type { AddressInfo } from 'node:net';
import react from '@vitejs/plugin-react';
import qrcode from 'qrcode-terminal';
import { defineConfig, type Plugin } from 'vite';

function findNetworkUrl(port: number, protocol: 'http' | 'https') {
    const interfaces = networkInterfaces();

    for (const network of Object.values(interfaces)) {
        for (const details of network ?? []) {
            if (details.family === 'IPv4' && !details.internal) {
                return `${protocol}://${details.address}:${port}/`;
            }
        }
    }

    return undefined;
}

function qrCodePlugin(): Plugin {
    return {
        name: 'dev-qr-code',
        apply: 'serve',
        configureServer(server) {
            server.httpServer?.once('listening', () => {
                const address = server.httpServer?.address();

                if (!address || typeof address === 'string') {
                    return;
                }

                const resolvedAddress = address as AddressInfo;
                const protocol = server.config.server.https ? 'https' : 'http';
                const url =
                    server.resolvedUrls?.network[0] ??
                    findNetworkUrl(resolvedAddress.port, protocol);

                if (!url) {
                    return;
                }

                server.config.logger.info(
                    '\nScan this QR code to open the dev server on your phone:\n',
                );
                qrcode.generate(url, { small: true });
                server.config.logger.info(`\nNetwork URL: ${url}\n`);
            });
        },
    };
}

export default defineConfig({
    plugins: [react(), qrCodePlugin()],
    server: {
        host: true,
    },
    preview: {
        host: true,
    },
});
