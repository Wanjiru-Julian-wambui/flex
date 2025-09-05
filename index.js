import jsonfile from 'jsonfile';
import moment from 'moment';
import simpleGit from 'simple-git';

const path = "./data.json";

// makeCommits function with recursive calls
const makeCommits = (n) => {
    if(n === 0) {
        console.log('All commits completed, pushing to remote...');
        return simpleGit().push();
    }
    
    const x = Math.floor(Math.random() * 54); // random between 0-53
    const y = Math.floor(Math.random() * 6);  // random between 0-5
    const date = moment().subtract(1, "y").add(1, "d").add(x, "w").add(y, "d").format();
    
    const data = {
        date: date,
        commit: n,
    };
    
    console.log(`Creating commit ${n}: ${date}`);
    
    jsonfile.writeFile(path, data, () => {
        simpleGit().add([path]).commit(date, {"--date": date}, () => {
            // Recursive call with decremented n
            makeCommits(n - 1);
        });
    });
};

// Async version with better error handling
const makeCommitsAsync = async (n) => {
    if(n === 0) {
        console.log('All commits completed, pushing to remote...');
        try {
            await simpleGit().push();
            console.log('Successfully pushed to remote');
        } catch (error) {
            console.log('Could not push to remote:', error.message);
        }
        return;
    }
    
    const x = Math.floor(Math.random() * 54); // random between 0-53
    const y = Math.floor(Math.random() * 6);  // random between 0-5
    const date = moment().subtract(1, "y").add(1, "d").add(x, "w").add(y, "d").format();
    
    const data = {
        date: date,
        commit: n,
    };
    
    console.log(`Creating commit ${n}: ${date}`);
    
    try {
        await jsonfile.writeFile(path, data);
        const git = simpleGit();
        await git.add([path]);
        await git.commit(date, {"--date": date});
        
        // Add small delay to avoid overwhelming git
        setTimeout(() => {
            makeCommitsAsync(n - 1);
        }, 100);
        
    } catch (error) {
        console.error(`Error creating commit ${n}:`, error);
    }
};

// markCommit function with x, y parameters
const markCommit = (x, y) => {
    const date = moment()
        .subtract(1, "y")  // subtract 1 year
        .add(1, "d")       // add 1 day
        .add(1, "w")       // add 1 week
        .add(y, "d")       // add y days
        .format();

    const data = {
        date: date,
    };

    console.log(date);
    jsonfile.writeFile(path, data, () => {
        simpleGit().add([path]).commit(date, {"--date": date}).push();
    });
};

// Alternative: More flexible version using x and y parameters
const markCommitFlexible = (x, y) => {
    const date = moment()
        .subtract(x, "days")  // subtract x days
        .add(y, "days")       // add y days
        .format();

    const data = {
        date: date,
        x: x,
        y: y,
    };

    return { date, data };
};

// Use async/await version for better error handling
async function writeDataAndCommit(x = 365, y = 0) {
    try {
        // Create date based on x, y parameters
        const date = moment()
            .subtract(x, "days")  // subtract x days
            .add(y, "days")       // add y days
            .format();

        const data = {
            date: date,
            x: x,
            y: y,
            coordinates: `(${x}, ${y})`,
        };

        // Write the data to file
        await jsonfile.writeFile(path, data);
        console.log(`Date saved to data.json: ${date} with coordinates (${x}, ${y})`);
        
        // Initialize git
        const git = simpleGit();
        
        // Add the file to staging
        await git.add([path]);
        console.log('File added to git staging');
        
        // Commit with the date as message and commit date
        await git.commit(date, {'--date': date});
        console.log('Changes committed with date:', date);
        
        // Push to remote repository
        try {
            await git.push();
            console.log('Changes pushed to remote repository');
        } catch (pushError) {
            console.log('Note: Could not push to remote repository. Make sure you have a remote configured.');
            console.log('To add a remote: git remote add origin <your-repo-url>');
        }
        
    } catch (error) {
        console.error('Error:', error);
    }
}

// Call the function - choose one:

// Option 1: Use the callback version (original style)
// makeCommits(100);

// Option 2: Use the async version (recommended)
makeCommitsAsync(1);

// Option 3: Single commit
// markCommit(10, 5);