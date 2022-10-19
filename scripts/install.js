import {__dirname} from 'path';
import {exit, chdir, cwd} from 'process';
import {spawn} from 'child_process';

/**
 * @brief Change the current working directory to the directory of the script
 * @param {string} path
 * @return {string}
 */
const cd = (path) => {

    /**
     * @brief Does the target path exist?
     * @param {string} path
     * @return {boolean}
     */
    const exists = (path) => {
        try {
            return !!require('fs').statSync(path);
        } catch (e) {
            return false;
        }
    }

    if (exists(path)) {

        /**
         * @brief Get the current working directory for comparison
         * @type {string}
         */
        const oldDir = cwd();

        /**
         * @brief Change the current working directory to the specified path
         */
        chdir(path.toString());

        /**
         * @brief Get the new working directory for comparison
         * @type {string}
         */
        const newDir = cwd();

        /**
         * @brief If the old and new working directories are the same, then the path was invalid
         */
        if (oldDir === newDir) {
            console.warn(`Failed to change directory to ${path}`);
            throw new Error(`Failed to change directory to ${path}`);
        }

        /**
         * @brief Return the new working directory
         */
        return newDir;
    } else {
        console.warn(`Failed to change directory to ${path}`);
        throw new Error(`Failed to change directory to ${path}`);
    }
}


/**
 * @brief Set the directory to the script's parent directory
 * @type {string}
 */
const oriDir = cwd();
const dir = `${__dirname}/../`;


/**
 * @brief change the current working directory to the script's parent directory
 * @type {void}
 */
try {
    cd(dir);
} catch (e) {
    exit(1);
}


/**
 * @brief Install the dependencies
 */
try {
    require('child_process').execSync('pnpm install', {stdio: 'inherit', cwd: dir, env: process.env});
} catch (e) {
    exit(1);
}

/* language=nodejs */
/* path=scripts/install.js */
/* Copilot requirements: */
/* 1. Create a new process */
/* 2. In the new process, we call the command:
/*    pnpm run dev -- --open */
/* 3. The new process inherits everything from the current process */
/* 4. The new process is detached from the current process */
/* 5. We do not wait for the new process to finish */
/* 6. We goto the label restore_cwd */
/* 7. We exit the current process */
/* 8. We restore the current working directory */
/* 9. We exit the current process */

/**
 * @brief Create a new process
 * @type {ChildProcess}
 * @see https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
 * @see https://nodejs.org/api/child_process.html#child_process_child_process_execsync_command_options
 * @see https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
 * @see https://nodejs.org/api/child_process.html#child_process_child_process_spawnsync_command_args_options
 */
const child = spawn('pnpm', ['run', 'dev', '--', '--open'], {
    cwd: dir,
    detached: true,
    stdio: 'inherit',
    env: process.env
});

/**
 * @brief Unlink the child process from the current process so it operates independently
 */
child.unref();

/**
 * @brief We restore the current working directory
 */
try {
    cd(oriDir);
} catch (e) {
    exit(1);
}

/**
 * @brief Exit the script
 */
exit(0);