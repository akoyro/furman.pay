package furman.core;

import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;
import org.springframework.boot.autoconfigure.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;

import javax.sql.DataSource;

/**
 * Created by akoiro on 9/14/15.
 */
@Configuration
@EnableJpaRepositories(basePackages = "furman.core", entityManagerFactoryRef = "mysqlEntityManager")
public class CoreConfig {

    @Bean
    @ConfigurationProperties(prefix = "core.datasource")
    public DataSource mysqlDataSource() {
        return DataSourceBuilder
                .create()
                .build();
    }


    @Bean(name = "mysqlEntityManager")
    public LocalContainerEntityManagerFactoryBean mysqlEntityManagerFactory(
            EntityManagerFactoryBuilder builder) {
        return builder.dataSource(mysqlDataSource())
                .packages("furman.core.model")
                .build();
    }
}