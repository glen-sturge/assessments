explain your thought process on creating the database schema and your parser

    As far as the schema goes, I only have one table 'user' holding the data from the csv.

    Honestly, this is not something I had tackled before and I haven't been working with node for a while either. So I sought out guides to go over the process.
    There are a number of popular npm packages for parsing csv. fast-csv, csv-parse, csv-parser and csvtojson ...etc
    I went with csv-parser because it worked. I did try some others and they worked too. I just couldn't see any major difference in the results.

    Initially I did not have the parsing wrapped in async and it seemed all the records weren't making it in. The inserts were being called before the results were finished.

    The mysql package wasn't working for me. Apparently there is issues with using this package with newer versions mysql server.
    Stackoverflow to the rescue ->
    mysql2 is a forked package that does the same thing but works on newer versions.
    It seems to use the mysql package, one might have to downgrade mysql server.

    Initially, based on the guide I followed, I was inserting each record one by one and it was very slow.

    Then I batched them in groups of 1000, but I just read 500mb is limit for mysql packet size and that's much bigger than the file provided so I just fed the results directly in without batching and that also worked fairly quickly.

    This is the output:
    ResultSetHeader {
        fieldCount: 0,
        affectedRows: 100000,
        insertId: 1,
        info: 'Records: 100000  Duplicates: 0  Warnings: 0',
        serverStatus: 2,
        warningStatus: 0,
        changedRows: 0
    }

    Right now, the script is not exiting. I believe it has to do with the db connection. When simply parsing and logging results the script exits fine.



    As for finding how many are between the ages of 18 and 21 I went into workbench and queried

    SELECT
        COUNT(*) as count
    FROM user
    WHERE
        timestampdiff(year, date_of_birth, curdate()) BETWEEN 18 AND 21;

    This gave me the number 3448.

    For What is the most frequent First Name?

    SELECT first_name
    FROM user
    GROUP BY first_name
    ORDER BY COUNT(*) DESC
    LIMIT 1;

    This seems to be the most straight forward and simple way of doing it.

    result is 'Stefanie'
