package furman.pay.repository;

import furman.pay.model.PayOrder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 * Created by akoiro on 9/14/15.
 */

@RepositoryRestResource(collectionResourceRel = "payOrder", path = "payOrder")
public interface PayOrderRepository extends MongoRepository<PayOrder, String>,
        QueryDslPredicateExecutor<PayOrder> {
}
