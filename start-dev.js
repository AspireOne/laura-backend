const { spawn } = require("child_process");
const { platform } = require("os");

const isWindows = platform() === "win32";

// Start NestJS app - THIS is the main command, just like you would put into package.json
const nestProcess = spawn("nest", ["start", "-b", "swc", "--type-check", "--watch"], {
  stdio: ["inherit", "pipe", "inherit"],
  shell: isWindows,
});

// Start pino-pretty
const pinoPrettyProcess = spawn("pino-pretty", [], {
  stdio: ["pipe", "inherit", "inherit"],
  shell: isWindows,
});

// Pipe NestJS output to pino-pretty
nestProcess.stdout.pipe(pinoPrettyProcess.stdin);

// Handle termination
function cleanup() {
  console.log("Terminating processes...");

  // On Windows, we need to use taskkill to properly terminate the processes
  if (isWindows) {
    spawn("taskkill", ["/pid", nestProcess.pid, "/F", "/T"]);
    spawn("taskkill", ["/pid", pinoPrettyProcess.pid, "/F", "/T"]);
  } else {
    nestProcess.kill();
    pinoPrettyProcess.kill();
  }

  // Exit the parent process
  process.exit();
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

// If the NestJS process exits, also exit pino-pretty
nestProcess.on("exit", (code, signal) => {
  console.log(`NestJS process exited with code ${code} and signal ${signal}`);
  cleanup();
});

// If pino-pretty exits, also exit the NestJS process
pinoPrettyProcess.on("exit", (code, signal) => {
  console.log(`pino-pretty process exited with code ${code} and signal ${signal}`);
  cleanup();
});
